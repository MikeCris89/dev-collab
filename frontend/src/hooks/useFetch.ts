import { useState } from "react";

const useFetch = (path: string) => {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<any>(null);

	return { isLoading, data };
};

export default useFetch;
