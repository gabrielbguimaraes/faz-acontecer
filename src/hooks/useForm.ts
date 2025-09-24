import { useState } from 'react';

					export const useForm = <T extends object>(initialState: T) => {
						const [values, setValues] = useState(initialState);

						const handleChange = (name: keyof T, value: any) => {
							setValues(prev => ({
								...prev,
								[name]: value
							}));
						};

						return {
							values,
							handleChange,
						};
					};