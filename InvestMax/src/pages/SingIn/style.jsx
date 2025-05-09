import styled from "styled-components";

export const Main = styled.div`
    background-color: #013024;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
`

export const Logo = styled.img`
    min-width: 100px;
    max-width: 150px;
    border-radius: 20px;

` 

export const Section = styled.section`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #013024;
    width: 100%;
    `

export const Campus = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    gap: 20px;
    min-width: 600px;
    background-color: #e6e6e6;
    padding: 50px;

    >form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 800px;
        >div {
            display: flex;
            flex-direction: column;
            gap: 3px;
            >input{
                border: 1px solid #012034;
                padding: 5px;
                width: 100%;
                outline: none;
            }
        }
    >button {
        background-color : #012034;
        border: none;
        padding: 8px;
        color: #e6e6e6;
        font-size: 18px;
        border: 1px solid #012034;
        transition: 0.6s;
        
    }
    >button:hover {
        background-color: #023657;
        color: #e6e6e6;
        border: 1px solid #012034;
    }
    }
`
