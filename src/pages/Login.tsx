// UI ImportS 👇
import { UserAuthForm } from "@/components/user-auth-form";
import { ModeToggle } from "@/components/mode-toggle";
// Icons and images 👇
import FlyEaseLogo from "@/assets/Logo-removebg-preview.png";
import PlaneLanding from "@/assets/plane_landing.jpeg";

export const Login = () => {
  return (
    <>
      {/* Lado izquierdo de la pagina (imagen) 👇 */} //TODO:Colocar Dichos con una fuente diferente y tamaño un poco mas grande, ademas de colocarlos en la mitad procurando que vayan cambiando segun cierto periodo de tiempo a otro aleatorio 
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ModeToggle />
        </div>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div
            className="absolute inset-0 bg-zinc-900 brightness-50"
            style={{ backgroundImage: `url(${PlaneLanding})`, backgroundSize: "cover" }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src={FlyEaseLogo} alt="" className="w-20 h-16" />
            FlyEase Manager
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">&ldquo;No volamos porque tenemos alas, volamos porque somos soñadores.&rdquo;</p>
              <footer className="text-sm">Neil Armstrong</footer>
            </blockquote>
          </div>
          M
        </div>
        {/* Parte derecha de la pagina (Inicio de sesion) 👇 */}  //TODO:Hacer la verificacion de Usuario y contraseña, si es erroneo mostrar un mensaje de inicio de sesion
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
              <p className="text-sm text-muted-foreground">Ingresa tu usuario y contraseña</p> 
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  );
};
