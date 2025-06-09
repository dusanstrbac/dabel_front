import axios from "axios";

// Za SWT keshiranje podataka ( sa fetcha )

export const fetcher = (url: string) => axios.get(url).then(res => res.data);