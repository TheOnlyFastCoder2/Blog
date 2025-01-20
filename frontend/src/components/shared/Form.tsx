import { Field } from "@/components/ui/field";
import { Flex, Input, Button, Text } from "@chakra-ui/react";
import { useRef, useState, useTransition } from "react";
import regexLibrary, { TRegexLibraryKeys } from "@/libs/regex-library";

interface IFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}

export interface IFormData {
  [key: string]: { error: string; value: string };
}

interface IPolymorphicFormProps {
  fields: IFieldConfig[];
  onSubmit: (formData: IFormData) => void;
}

export default function PolymorphicForm({ fields, onSubmit }: IPolymorphicFormProps) {
  const [isPending, startTransition] = useTransition();
  const isInputsValid = useRef<boolean>(false);
  const [inputs, setInputs] = useState<IFormData>(
    fields.reduce((acc, field) => {
      acc[field.name] = { error: '', value: '' };
      return acc;
    }, {} as IFormData)
  );

  const handleInputChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = currentTarget;

    setInputs((prevInputs) => {
      const updatedInputs = { ...prevInputs, [name]: { ...prevInputs[name], value } };

      if (name === 'confirmPassword') {
        updatedInputs.confirmPassword.error = (
          !!updatedInputs.confirmPassword.value && updatedInputs.confirmPassword.value !== updatedInputs.password.value
            ? "Пароли не совпадают"
            : ''
        );

        isInputsValid.current = !updatedInputs.confirmPassword.error;
      }

      if (name in regexLibrary) {
        const { regex, error } = regexLibrary[name as TRegexLibraryKeys];
        updatedInputs[name].error = regex.test(value) ? '' : error;
        isInputsValid.current = regex.test(value);
      }

      return updatedInputs;
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isInputsValid.current) return;
    startTransition(onSubmit.bind(null, inputs))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="2">
        {fields.map(({ name, label, placeholder, type = 'text' }) => (
          <Field key={name} label={label} required>
            <Input
              onChange={handleInputChange}
              type={type}
              name={name}
              placeholder={placeholder}
            />
            {!!inputs[name].error && (
              <Text fontSize="sm" w="full" color="fg.error" bg="bg.error" px="2" py="4">
                {inputs[name].error}
              </Text>
            )}
          </Field>
        ))}
        <Button type="submit" mt="10px" disabled={isPending}>Отправить</Button>
      </Flex>
    </form>
  );
}