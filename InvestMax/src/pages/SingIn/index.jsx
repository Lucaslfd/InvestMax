import { Campus, Logo, Main, Section } from "./style"
import InvestMax from "../../assets/InvestMax.png"
export default function SingIn() {
    return(
        <Main>
            <Section>
                <Logo src={InvestMax} alt="" />
                <Campus>
                    <form action="">
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
                        <button>Login com Google</button>
                        <p>Ainda não tem ma conta?</p>
                        <a href="/registre-se">Cadastre-se</a>
                    </div>
                </Campus>
            </Section>
            
        </Main>
    )
}