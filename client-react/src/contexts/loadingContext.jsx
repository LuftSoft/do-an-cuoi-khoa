import { createContext, useContext, useState } from "react";

const initValue = false;
const LoadingServiceContext = createContext();

export const LoadingServiceProvider = ({ children }) => {
	const [loading, setLoading] = useState(initValue);
	return <LoadingServiceContext.Provider value={{ loading, setLoading }}>{children}</LoadingServiceContext.Provider>;
};

export const useLoadingService = () => {
	const context = useContext(LoadingServiceContext);
	if (context) {
		return context;
	} else {
		throw new Error("Context not found!");
	}
};
