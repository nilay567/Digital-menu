import React, { useEffect } from "react";
import "./Createmenu.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Title from "../Title/Title";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";

const CreateMenu = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { user, create } = useAuth();
  const [params] = useSearchParams();
  const returnUrl = params.get("returnUrl");

  useEffect(() => {
    if (!user) return;
    returnUrl ? navigate(returnUrl) : navigate("/");
  }, [user]);

  const submit = async data => {
    // data.append("userId",user.id);
    const newData = {
      userId: user.id,
      name: data.name,
      desc: data.desc,
      price: data.price,

      // data: data.current,
      // desc: desc.current.value,
    };
    console.log(newData)
    await create(newData);
  };
  return (
    <div className="LoginContainer">
      <div className="LoginDetails">
        <Title title="Create Menu" />
        <form onSubmit={handleSubmit(submit)} noValidate>
          {/* <Input
            type="userId"
            label="userId"
            {...register("userId", {
              required: true,
            })}
            error={errors.userId}
          /> */}

          <Input
            type="name"
            label="name"
            {...register("name", {
              required: true,
            })}
            error={errors.name}
          />

          <Input
            type="desc"
            label="desc"
            {...register("desc", {
              required: true,
            })}
            error={errors.desc}
          />
          <Input
            type="price"
            label="Price"
            {...register("price", {
              required: true,
            })}
            error={errors.price}
          />
          <Button type="submit" text="Add" />

          

          {/* <div className="register">
            New user? &nbsp;
            <Link to={`/register${returnUrl ? '?returnUrl=' + returnUrl : ''}`}>
              Register here
            </Link>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default CreateMenu;
