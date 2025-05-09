import styled from "styled-components";

export const Cabecalho = styled.header`
    background-color: #001d16;
    box-shadow: 0px 4px 8px rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
`

export const LogoInvestMax = styled.div`
    >img {
        width: 80px;
        border-radius: 10%;
    }
`

export const Logos = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    
`

export const Logos_img = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    >img {
        width: 50px;
        border-radius: 50%;
    }
    >p {
        font-size: 12px;
    }
`