import { useRef, useState, useEffect } from 'react';
import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';

import { Container, RoundaboutContent,  ControlButton, Gradient } from './styles';

export function Roundabout({ content, title }) {
    const roundaboutOfFoods = useRef(null);
    const [isEndOfScroll, setIsEndOfScroll] = useState(false);
    const [isStartOfScroll, setIsStartOfScroll] = useState(true);

    const handleScroll = () => {
        const container = roundaboutOfFoods.current;
        setIsEndOfScroll(container.scrollWidth - container.clientWidth <= container.scrollLeft);
        setIsStartOfScroll(container.scrollLeft <= 0);
    };

    useEffect(() => {
        const container = roundaboutOfFoods.current;
        handleScroll();
    
        const handleResize = () => {
          handleScroll();
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
     
      const scroll = (direction) => {
        const container = roundaboutOfFoods.current;
        const scrollAmount = direction === 'left' ? -180 : 180;
        container.scrollLeft += scrollAmount;
        // Atualiza os estados após o scroll
        handleScroll();
    };

    return (
        <Container>
            <h2>{title}</h2>
            <RoundaboutContent 
                ref={roundaboutOfFoods}>
                {content}
            </RoundaboutContent>
            
            {!isStartOfScroll && (
                <ControlButton 
                    onClick={() => scroll('left')}>
                    <TfiAngleLeft />
                </ControlButton>
            )}

            {!isEndOfScroll && (
                <ControlButton 
                    onClick={() => scroll('right')}>
                    <TfiAngleRight />
                </ControlButton>
            )}
            <Gradient
                className="left" />
            <Gradient
                className="right" />
        </Container>
    );
}