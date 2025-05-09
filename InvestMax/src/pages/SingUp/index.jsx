
import { Campus, Logo, Main, Section } from "../SingIn/style"
import InvestMax from "../../assets/InvestMax.png"
export default function SingUp() {
    return(
        <Main>
            <Section>
                <Logo src={InvestMax} alt="" />
                <Campus>
                    <form action="">
                        <div>
                            <label htmlFor="name">Nome:</label>
                            <input type="text" placeholder="Digite seu nome:"/>
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input type="email" placeholder="Digite seu email:"/>
                        </div>
                        <div>
                            <label htmlFor="password">Senha:</label>
                            <input type="password" placeholder="Digite sua senha:"/>
                        </div>
                        <button>Entrar</button>
                    </form>
                    <div>
                        <p>Já tem uma conta?</p>
                        <a href="/">Login</a>
                    </div>
                </Campus>
            </Section>
            
        </Main>
    )
}