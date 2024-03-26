// UI ImportS 👇
import { UserAuthForm } from "@/components/user-auth-form";
import { ModeToggle } from "@/components/mode-toggle";
// Icons and images 👇
import FlyEaseLogo from "@/assets/Logo-removebg-preview.png";
import PlaneLanding from "@/assets/plane_landing.jpeg";

export const Login = () => {
  return (
    <>
      {/* Lado izquierdo de la pagina (imagen) 👇 */} 
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
          <div className="absolute inset-y-0 left-0 w-26">
            <div className="h-full flex flex-col items-center justify-center">
              <div className="Relative">
                <p className="text-5xl font-style: italic">&ldquo;No volamos porque tenemos alas, volamos porque somos soñadores.&rdquo;</p>
                <p className="text-2xl font-medium  bottom-0 left-0 mt-4">-Neil Armstrong</p> 
              </div>
            </div>   
          </div>
        </div>
        {/* Parte derecha de la pagina (Inicio de sesion) 👇 */} 
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
