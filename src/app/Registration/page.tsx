"use client";

import { validateForm } from '../helpers/formHelper';
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";



export default function Registration() {
  const router = useRouter();
  const handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    validateForm();

    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData);

     
      if(data.password !== data.repassword) {
        const repasswordEl = document.querySelector('#repasswordlLabel');
        const repasswordInputEl = document.querySelector('#repassword');

        repasswordInputEl?.classList.add('border-red-500');
     
        repasswordEl?.classList.remove('hidden');
        return;
      }
      const signInResult = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if(signInResult?.error) {
       
        return;
      }



      // redirect('/dashboard')
      router.push('/dashboard');
      router.refresh();
    } catch(err) {

    }

  } 
  return (
    <div className="flex overflow-hidden flex-col xl:h-full h-screen items-center justify-center gap-5 xl:gap-6 xl:w-[50%] mx-auto">
      <div className="bg-inherit p-4 xl:h-[100%] xl:p-10 xl:px-10 rounded-md flex flex-col shadow-personal gap-2 xl:gap-0">
        <div className="text-center text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">

          Register new user
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
                type='text'
                name='name'
                id='name'
                placeholder="Full name"
                
                className="border-2 p-3 xl:h-full rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border-gray-300 font-semibold"
              />
              <label htmlFor="name" 
                id='nameLabel'
                className="hidden text-[0.6rem] text-white place-self-end">

                Name is required
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

            <div className="flex flex-col relative xl:h-[100%]">
              <input 
                type='password'
                name='repassword'
                id='repassword'
                placeholder="Confirm password"
                
                className="border-2 p-3 xl:h-full rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border-gray-300 font-semibold"
              />
              <label htmlFor="repassword" 
                id='repasswordlLabel'
                className="hidden text-[0.6rem] text-white place-self-end">

                Please confirm password
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