import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, Controller, FieldValues, Path } from "react-hook-form"

interface FormFeildProp <T extends FieldValues> {
  control: Control<T>,
  name: Path<T>,
  label: string,
  placeHolder: string,
  type: "text" | "email" | "password"
} 

const FormField  = <T extends FieldValues>({control,name,label,placeHolder,type}:FormFeildProp<T>) => {
  return (
    <> 
    <Controller
       control={control}
       name={name}
       render={({ field }) => (
         <FormItem>
           <FormLabel>{label}</FormLabel>
           <FormControl>
             <Input type={type} placeholder={placeHolder} {...field} />
           </FormControl>
           <FormMessage />

         </FormItem>
       )}
     />
    </>
  )
}

export default FormField
