import ManagerRole from "@/manager-bc/role/manager-role";

export default abstract class AbstractManagerService {
  constructor(protected manager: ManagerRole) {}
}
