export const selectProducts = state => state.productList.products;
export const selectLoading = state => state.productList.loading;
export const selectError = state => state.productList.error;

//Implemnting in FE

/*
const products = useSelector(selectProducts);
const loading = useSelector(selectLoading);
const error = useSelector(selectError);

*/