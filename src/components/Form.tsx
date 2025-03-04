import React from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof formSchema>;

type FormProps = {
  onSubmit: (name: string, description: string) => void;
  text?: React.ReactNode;
  defaultValues?: { name: string; description: string };
  action: string;
};

const Form: React.FC<FormProps> = ({
  onSubmit,
  text,
  defaultValues,
  action,
}) => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <View
      style={{ backgroundColor: "#2C3D4F" }}
      className="flex-1 justify-center items-center p-5"
    >
      {text && text}
      <View className="w-full gap-5">
        <View>
          <Text className="text-lg self-start font-medium text-[#F1E8DF] mb-2">
            Name:
          </Text>
          <TextInput
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-1 text-gray-800"
            style={{ backgroundColor: "#F1E8DF" }}
            placeholder="Name"
            defaultValue={defaultValues?.name}
            onChangeText={(text) => setValue("name", text)}
          />
          {errors.name && (
            <Text className="text-red-500 mb-2">{errors.name.message}</Text>
          )}
        </View>
        <View>
          <Text className="text-lg self-start font-medium text-[#F1E8DF] mb-2">
            Description:
          </Text>
          <TextInput
            style={{ backgroundColor: "#F1E8DF" }}
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-1 text-gray-800"
            placeholder="Description"
            defaultValue={defaultValues?.description}
            onChangeText={(text) => setValue("description", text)}
            multiline
          />
          {errors.description && (
            <Text className="text-red-500 mb-2">
              {errors.description.message}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSubmit((data) => onSubmit(data.name, data.description))}
        className="bg-[#D6E3B2] px-6 py-3 rounded-lg mt-[15]"
      >
        <Text className="text-black text-sm font-medium">{action}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Form;
