import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Route } from 'react-router-dom';

interface IProps {
  path: string,
  element: ReactNode
}

const PrivateRoute = (props: IProps) => {
  const { path, element } = props;
  const { menuList } = useSelector((state: Record<string, any>) => state.role);



  return (
    <>
      <Route path={path}>
        <>1111</>
      </Route>
    </>
  )
}

export default PrivateRoute;
