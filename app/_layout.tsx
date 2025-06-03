import { NavigationIndependentTree } from "@react-navigation/native";

import App from './index';

export default function Main() {
  return (
    <NavigationIndependentTree>
      <App/>
    </NavigationIndependentTree>
  );
}
