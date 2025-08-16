
export const validateForm: () => void = () => {
  const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('input');

  const labels: NodeListOf<HTMLLabelElement> = document.querySelectorAll('label');
  inputs.forEach((input: HTMLInputElement, index: number) => {

    if(input.value === '') {
      input.classList.add('border-red-500');

      labels[index].classList.remove('hidden');
    } else {
      if(input.classList.contains('border-red-500')) {
        input.classList.remove('border-red-500');
      }

      if(!labels[index].classList.contains('hidden')) {
        labels[index].classList.add('hidden');
      }
    }

    if(input.id === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(input.value)) {
      if(!input.classList.contains('border-red-500')) {
        input.classList.add('border-red-500');
        
      }
      if(labels[index].classList.contains('hidden')) {
        labels[index].classList.remove('hidden');
      }
    }
  })
}