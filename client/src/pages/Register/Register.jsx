import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/Input/Input";
import Title from "../../components/Title/Title";
import "./Register.css";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterPage() {
  const auth = useAuth();
  const { user } = auth;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnUrl = params.get("returnUrl");

  useEffect(() => {
    if (!user) return;
    returnUrl ? navigate(returnUrl) : navigate("/");
  }, [user, navigate, returnUrl]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    const userData = {
      ...data,
      isAdmin: data.role === 'admin' 
    };
    console.log(userData); 
    await auth.register(userData); 
  };

  return (
    <div className="registerContainer">
      <div className="registerDetails">
        <Title title="Register" />
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            type="text"
            label="Name"
            {...register("name", {
              required: true,
              minLength: 5,
            })}
            error={errors.name}
          />

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
              minLength: 5,
            })}
            error={errors.password}
          />

          <Input
            type="password"
            label="Confirm Password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value !== getValues("password")
                  ? "Passwords Do Not Match"
                  : true,
            })}
            error={errors.confirmPassword}
          />

          <div className="role-select">
            <label htmlFor="role">Register as:</label>
            <select
              id="role"
              {...register('role', { required: true })}
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="error">Please select a role</p>}
          </div>

          <Button type="submit" text="Register" />

          <div className="login">
            Already a user? &nbsp;
            <Link to={`/login${returnUrl ? "?returnUrl=" + returnUrl : ""}`} style={{color:"#3b5998"}}>
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
