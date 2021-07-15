import { Permission } from "../Model/Permission";
import { PermTypes } from "./PermTypes";

export function seeder() {
    const permissions: Permission[] = [];

    permissions.push(new Permission("Send all your data to Mr Zuck", PermTypes.Nss));
    permissions.push(new Permission("Record and store all private interactions", PermTypes.Nss));
    permissions.push(new Permission("Harvest device specifications", PermTypes.Pms));
    permissions.push(new Permission("Laugh at your poor life choices", PermTypes.Pms));
    permissions.push(new Permission("Send you daily monke memes", PermTypes.All));
    permissions.push(new Permission("Read Berserk by Kentaro Miura on your behalf", PermTypes.All));

    return permissions;
}