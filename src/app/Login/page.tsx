"use client";
import { onSubmitEventCallback } from '../types/functions';
import { validateForm } from '../helpers/formHelper';



export default function Login() {
  
  const handleSubmit: onSubmitEventCallback = (event: React.FormEvent<HTMLFormElement>) => {
  
    event.preventDefault();
   

    validateForm();
  }
  return (
    <div className="flex flex-col xl:h-full h-screen items-center justify-center gap-5 xl:gap-6 xl:w-[50%] mx-auto">
      <div className="bg-inherit p-4 xl:h-[100%] xl:p-10 xl:px-10 rounded-md flex flex-col shadow-personal gap-2 xl:gap-0">
        <div className="text-center text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">

          Login
        </div>
        <form
          onSubmit={handleSubmit} 
          className="mt-8">
          <div className="space-y-4">
           
          
            <div className="flex flex-col relative xl:h-[100%]">
              <input 
                type='text'
                name='email'
                id='email'
                placeholder="Email"
                
                className="border-2 p-3 xl:h-full rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border-gray-300 font-semibold"
              />
              <label htmlFor="email" 
                id='emailLabel'
                className="hidden text-[0.6rem] text-white place-self-end">

                Email is required
              </label>

            </div>

            <div className="flex flex-col relative xl:h-[100%]">
              <input 
                type='password'
                name='password'
                id='password'
                placeholder="Password"
                
                className="border-2 p-3 xl:h-full rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border-gray-300 font-semibold"
              />
              <label htmlFor="password" 
                id='passwordlLabel'
                className="hidden text-[0.6rem] text-white place-self-end">

                Password is required
              </label>

            </div>



          </div>
          <div className="flex flex-col shadow-md h-full mt-4">
            <button type="submit"
              className="bg-green-500 hover:bg-green-700 text-center p-3 rounded-md text-white uppercase"
              >
                Submit
              </button>
          </div>
        </form>
      </div>
    </div>
  )
}