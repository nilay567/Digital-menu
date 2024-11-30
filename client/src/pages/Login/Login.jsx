import React, { useEffect } from "react";
import "./Login.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Title from "../../components/Title/Title.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [params] = useSearchParams();
  const returnUrl = params.get("returnUrl");

  useEffect(() => {
    if (!user) return;

    returnUrl ? navigate(returnUrl) : navigate("/");
  }, [user]);

  const submit = async ({ email, password }) => {
    await login(email, password);
  };

  return (
    <div className="LoginContainer">
      <div className="LoginDetails">
        <Title title="Login" />
        <form onSubmit={handleSubmit(submit)} noValidate>
        <Input
            type="email"
            label="Email"
            {...register("email", {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                message: "Email Is Not Valid",
              },
            })}
            error={errors.email}
          />

          <Input
            type="password"
            label="Password"
            {...register("password", {
              required: true,
            })}
            error={errors.password}
          />
          <Button type="submit" text="LogIn" />

          <div className="register">
            New user? &nbsp;
            <Link to={`/register${returnUrl ? "?returnUrl=" + returnUrl : ""}`} style={{color:"#3b5998"}}>
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
