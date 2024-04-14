import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';
import moment from 'moment';
import 'moment-timezone';
import { ThemeContext } from 'styled-components';
import { FaCircle } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';;  // Importa a biblioteca do Toaster do react-hot-toast
import { Container, Request, Status, RequestId, Items, Date, RequestAdmin, StatusAdmin } from './styles';

export function CardRequest({ data }) {
  const theme = useContext(ThemeContext);
  const { isAdmin } = useAuth();

  const queryWidth = 1050;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth >= queryWidth);

  const [selectedStatus, setSelectedStatus] = useState(data.status);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Utiliza o useCallback para garantir que a função tenha sempre a versão mais recente de queryWidth
  const handleResize = useCallback(() => { setWindowWidth(window.innerWidth >= queryWidth);  }, [queryWidth]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  function formatDate(dateString) {
    const dataMoment = moment(dateString);
    dataMoment.tz(moment.tz.guess());
    const formattedDate = dataMoment.format("DD/MM [às] HH[h]mm");
    return formattedDate;
  }

  async function handleUpdateRequestStatus(status) {
    const confirmed = await new Promise((resolve) => {
      // Utiliza a biblioteca do toast do react-hot-toast
      toast.promise(
        <ConfirmationToast
          message={"Deseja realmente atualizar o status do pedido?"}
          confirm={"Atualizar"}
          cancel={"Cancelar"}
        />,
        {
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
          icon: '🔒',
        }
      );
    });

    if (confirmed) {
      try {
        setLoadingStatus(true);
        const response = await api.put(`/requests/${data.id}`, { status });

        if (response.status === 200) {
          setSelectedStatus(status);
          toast.success('Status atualizado com sucesso!');
        } else {
          toast.error('Erro ao atualizar o status. Por favor, tente novamente.');
        }
      } catch (error) {
        console.error("Erro ao processar a atualização:", error);
        toast.error("Erro ao processar a requisição. Por favor, tente novamente.");
      } finally {
        setLoadingStatus(false);
      }
    }
  }

  const handleStatus = (event) => {
    handleUpdateRequestStatus(event.target.value);
  };

  return (
    <Container>
      {isAdmin ? (
        <RequestAdmin>
          <StatusAdmin>
            <div>
              {[...Array(3)].map((_, index) => (
                <FaCircle 
                key={index} size={10} 
                style={{ color: theme.COLORS[index === 0 ? 'TOMATO_300' : (index === 1 ? 'CARROT_100' : 'MINT_100')] }} />
              ))}
              <select
                value={selectedStatus}
                onChange={handleStatus}
                disabled={loadingStatus}
              >
                <option value="Pendente">Pendente</option>
                <option value="Preparando">Preparando</option>
                <option value="Entregue">Entregue</option>
              </select>
            </div>
          </StatusAdmin>
          <RequestId>
            {String(data.id).padStart(8, "0")}
          </RequestId>
          <Items>
            {data.foods.map((food, index) => (
              <React.Fragment key={index}>
                {`${food.amount} x ${food.name}`}
                {index !== data.foods.length - 1 && ", "}
              </React.Fragment>
            ))}
          </Items>
          <Date>
            {formatDate(data.requests_at)}
          </Date>
        </RequestAdmin>
      ) : (
        <Request key={data.id}>
          <Status>
            {[...Array(3)].map((_, index) => (
              <FaCircle 
              key={index} size={10} 
              style={{ color: theme.COLORS[index === 0 ? 'TOMATO_300' : (index === 1 ? 'CARROT_100' : 'MINT_100')] }} />
            ))}
            {data.status}
          </Status>
          <RequestId>
            {String(data.id).padStart(8, "0")}
          </RequestId>
          <Items>
            {data.foods.map((food, index) => (
              <React.Fragment key={index}>
                {`${food.amount} x ${food.name}`}
                {index !== data.foods.length - 1 && ", "}
              </React.Fragment>
            ))}
          </Items>
          <Date>
            {formatDate(data.requests_at)}
          </Date>
        </Request>
      )}
      <Toaster />
    </Container>
  );
}
