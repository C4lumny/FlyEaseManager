import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRequest } from "@/hooks/useApiRequest";
import { useUserContext } from "@/contexts/userProvider";
// UI imports 👇
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loginError, setLoginError] = React.useState<boolean>(false);
  const [credentials, setCredentials] = useState({ usuario: "", clave: "" });
  const { apiRequest } = useRequest();
  const { createUser } = useUserContext();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const request = await apiRequest(credentials, "/FlyEaseApi/Administradores/Authentication", "post");
      const apiResponse = request.apiData;
      const { primaryToken, refreshToken } = apiResponse.tokens;

      localStorage.setItem("primaryToken", primaryToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (apiResponse.succes === true) {
        setIsLoading(false);
        createUser({ username: credentials.usuario, password: credentials.clave });
        navigate("/home/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      setLoginError(true);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="user">
              Usuario
            </Label>
            <Input
              id="user"
              name="usuario"
              placeholder="VictorTorrres"
              autoCapitalize="none"
              autoCorrect="off"
              // disabled={isLoading}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Contraseña
            </Label>
            <Input
              id="password"
              name="clave"
              placeholder="**************"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              // disabled={isLoading}
              onChange={handleChange}
            />
          </div>
          {/* TODO: Cuando el usuario vuelva a escribir, quitar este texto */}
          <div className={`text-red-500 font-semibold my-2${!loginError ? " hidden" : ""}`}>Usuario o contraseña incorrectos</div>
          <Button disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar sesión
          </Button>
        </div>
      </form>
    </div>
  );
}
