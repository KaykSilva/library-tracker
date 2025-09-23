"use client";
import React from "react";
import { ILoginForm } from "./type";
import { loginRequest } from "@/services/login";
import Cookies from "js-cookie";

const LoginForm = () => {
  const [formData, setFormData] = React.useState<ILoginForm>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const r = await loginRequest(formData);

      if (r !== undefined) {
        window.location.href = "/";
        console.log(r)
        Cookies.set("token", r.toString(), { expires: 7 });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex bg-zinc-300 items-center justify-center w-full h-screen">
        <div className="xl:mx-auto xl:w-full shadow-md p-4 xl:max-w-sm 2xl:max-w-md bg-amber-50 rounded-md">
          <div className="mb-2 flex justify-center" />
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Bem vindo(a) de volta!
          </h2>

          <form className="mt-8" method="POST" action="#">
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  E-mail
                </label>
                <div className="mt-2">
                  <input
                    name="email"
                    placeholder="E-mail"
                    type="email"
                    onChange={handleChange}
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm 
                      placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 
                      focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-gray-900">
                    Senha
                  </label>
                  <a
                    className="text-sm font-semibold text-black hover:underline"
                    href="#"
                  >
                    Esqueçeu a senha?
                  </a>
                </div>
                <div className="mt-2">
                  <input
                    name="password"
                    placeholder="Senha"
                    type="password"
                    onChange={handleChange}
                    disabled={loading}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm 
                      placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 
                      focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 
                    font-semibold leading-7 text-white hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Tentando entrar...
                    </span>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
