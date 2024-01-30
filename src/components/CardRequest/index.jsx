import React, { useEffect, useState, useContext } from 'react';

import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

import moment from 'moment';
import 'moment-timezone';
import { ThemeContext } from 'styled-components';
import { FaCircle } from 'react-icons/fa';

import { ConfirmationRequest } from '../../components/ConfirmationRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, RequestOrder, Status, RequestOrderId, PlateDetails, Date, RequestOrderAdminAccess, RequestStatusAdminAccess } from './styles';

export function CardRequest({ data }) {

  const theme = useContext(ThemeContext);

  const { isAdminAccess } = useAuth();

  const querySizeWidth = 1050;
  const [windowSizeWidth, setWindowSizeWidth] = useState(window.innerWidth >= querySizeWidth);

  const [selectedStatus, setSelectedStatus] = useState(data.status);
  const [loadingStatus, setLoadingStatus] = useState(false);

  function formatDate(dateString) {
    const dataMoment = moment(dateString);

    dataMoment.tz(moment.tz.guess());

    const formattedDate = dataMoment.format("DD/MM [às] HH[h]mm");

    return formattedDate;
  };

  async function handleUpdateRequestStatus(status) {
    const confirmed = await new Promise((resolve) => {

      const customId = "handleUpdateRequestStatus";

      toast(
        <ConfirmationRequest
          message={"Quer atualizar o status do pedido?"}
          confirm={"Atualizar"}
          cancel={"Cancelar"}
          onConfirm={() => resolve(true)}
          onCancel={() => resolve(false)}
        />, {
        toastId: customId,
        containerId: 'await'
      }
      );
    });

    if (confirmed) {
      try {
        setLoadingStatus(true);
        const response = await api.put(`/request/${data.id}`, { status });

        if (response.status === 200) {
          setSelectedStatus(status);
          toast('Status atualizado com sucesso!', { containerId: 'autoClose' });
        } else {
          toast('Erro ao atualizar o status, tente novamente.', { containerId: 'autoClose' });
        };
      } catch (error) {
        console.error("Erro ao processar a atualização:", error);
        toast("Erro ao processar pedido de atualização, tente novamente.", { containerId: 'autoClose' });
      } finally {
        setLoadingStatus(false);
      };
    };
  };

  const handleStatus = (event) => {
    handleUpdateRequestStatus(event.target.value)
  };

  function handleResize() {
    setWindowSizeWidth(window.innerWidth >= querySizeWidth)
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []);

  return (
    <Container>
      {
        isAdminAccess ? (
          <RequestOrderAdminAccess>
            <RequestStatusAdminAccess>
              <div>
                {
                  selectedStatus === "Pedido Pendente" &&
                  <FaCircle size={10} style={{ color: theme.COLORS.TOMATO_300 }} />
                }
                {
                  selectedStatus === "Preparando o Pedido" &&
                  <FaCircle size={10} style={{ color: theme.COLORS.CARROT_100 }} />
                }
                {
                  selectedStatus === "Pedido Entregue" &&
                  <FaCircle size={10} style={{ color: theme.COLORS.MINT_100 }} />
                }
                <select
                  value={selectedStatus}
                  onChange={handleStatus}
                  disabled={loadingStatus}
                >
                  <option value="Pedido Pendente">Pedido Pendente</option>
                  <option value="Preparando o Pedido">Preparando o Pedido</option>
                  <option value="Pedido Entregue">Pedido Entregue</option>
                </select>
              </div>
            </RequestStatusAdminAccess>

            <RequestOrderId>
              {String(data.id).padStart(8, "0")}
            </RequestOrderId>

            <PlateDetails>
              {data.plates.map((plate, index) => (
                <React.Fragment key={index}>
                  {`${plate.quantity} x ${plate.name}`}
                  {index !== data.plates.length - 1 && ", "}
                </React.Fragment>
              ))}
            </PlateDetails>

            <Date>
              {formatDate(data.requestorders_at)}
            </Date>
          </RequestOrderAdminAccess>
        ) : (
          <RequestOrder key={data.id}>
            <Status>
              {
                data.status === "Pedido Pendente" &&
                <FaCircle size={10} style={{ color: theme.COLORS.TOMATO_300 }} />
              }
              {
                data.status === "Preparando o Pedido" &&
                <FaCircle size={10} style={{ color: theme.COLORS.CARROT_100 }} />
              }
              {
                data.status === "Pedido Entregue" &&
                <FaCircle size={10} style={{ color: theme.COLORS.MINT_100 }} />
              }
              {data.status}
            </Status>

            <RequestOrderId>
              {String(data.id).padStart(8, "0")}
            </RequestOrderId>

            <Items>
              {data.plates.map((plate, index) => (
                <React.Fragment key={index}>
                  {`${plate.quantity} x ${plate.name}`}
                  {index !== data.plates.length - 1 && ", "}
                </React.Fragment>
              ))}
            </Items>

            <Date>
              {formatDate(data.requestorders_at)}
            </Date>
          </RequestOrder>
        )
      }
      <ToastContainer enableMultiContainer containerId={"await"} autoClose={false} draggable={false} />
      <ToastContainer enableMultiContainer containerId={'autoClose'} autoClose={1500} draggable={false} />
    </Container>
  )
}