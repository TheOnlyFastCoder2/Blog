import { RouterProvider } from 'react-router-dom';
import ReactDOM from "react-dom/client"
import App from "./routes";
import { Provider } from '@/components/ui/provider';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider>
    <RouterProvider router={App}/>
  </Provider>
)