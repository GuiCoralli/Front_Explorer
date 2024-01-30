import { useRef, useState, useEffect } from 'react';
import { TfiAngleLeft, TfiAngleRight } from 'react-icons/tfi';

import { SwitchContainer, Content, ControlLeft, ControlRight, GradientLeft, GradientRight } from './styles';

export function Switch({ content, title }) {
    const switchOfPlates = useRef(null);
    const [scrollToEnd, setScrollToEnd] = useState(false);
    const [scrollToStart, setScrollToStart] = useState(true);

    useEffect(() => {
        const switchContainer = switchOfPlates.current;
        setScrollToEnd(
            switchContainer.scrollWidth - switchContainer.clientWidth <= switchContainer.scrollLeft
        );

        const handleResize = () => {
            setScrollToEnd(
                switchContainer.clientWidth >= switchContainer.scrollWidth || ((switchContainer.clientWidth + switchContainer.scrollLeft + 10) >= switchContainer.scrollWidth)
            );

            setScrollToStart(
                switchContainer.scrollLeft <= 0
            );
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const scrollToLeft = () => {
        const switchContainer = switchOfPlates.current;
        switchContainer.scrollLeft -= 180;
        setScrollToEnd(false);
        setScrollToStart(switchContainer.scrollLeft - 330 <= 0);
    };

    const scrollToRight = () => {
        const switchContainer = switchOfPlates.current;
        switchContainer.scrollLeft += 180;
        setScrollToStart(false);
        setScrollToEnd((switchContainer.clientWidth + switchContainer.scrollLeft + 330) >= switchContainer.scrollWidth);
    };

    return (
        <SwitchContainer>
            <h2>{title}</h2>
            <Content ref={switchOfPlates}>{content}</Content>
            {!scrollToStart && (
                <ControlLeft onClick={scrollToLeft}>
                    <TfiAngleLeft />
                </ControlLeft>
            )}
            {!scrollToEnd && (
                <ControlRight onClick={scrollToRight} >
                    <TfiAngleRight />
                </ControlRight>
            )}
            <GradientLeft />
            <GradientRight />
        </SwitchContainer>
    );
}