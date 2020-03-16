import App from "./react/app";
import { createElement } from "react";
import { render } from "react-dom";

import Network from "./network";
import BlockChain from "../blockchain/blockchain";

export const bc = new BlockChain();
export const network = new Network(bc);



render(createElement(App),document.body);

network.connectToNodes();
