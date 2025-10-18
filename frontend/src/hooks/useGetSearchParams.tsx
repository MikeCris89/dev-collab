import { useSearchParams } from "react-router-dom";

const useGetSearchParams = (paramList: string[]) => {
	const [searchParams] = useSearchParams();
	const paramValues: (string | null)[] = [];

	paramList.forEach((param) => {
		paramValues.push(searchParams.get(param));
	});

	return paramValues;
};

export default useGetSearchParams;
