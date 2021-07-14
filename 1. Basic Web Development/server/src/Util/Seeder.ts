import { Permission } from "../Model/Permission";

export function seeder() {
    const permissions: Permission[] = [];

    permissions.push(new Permission("Send all your data to Mr Zuck", "permissionNss"));
    permissions.push(new Permission("Record and store all private interactions", "permissionNss"));
    permissions.push(new Permission("Harvest device specifications", "permissionPms"));
    permissions.push(new Permission("Laugh at your poor life choices", "permissionPms"));
    permissions.push(new Permission("Send you daily monke memes", "permissionAll"));
    permissions.push(new Permission("Read Berserk by Kentaro Miura on your behalf", "permissionAll"));

    return permissions;
}