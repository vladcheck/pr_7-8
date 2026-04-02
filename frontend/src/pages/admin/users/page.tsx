import useApi from "@/features/api/useApi";
import useNotify from "@/features/notifications/useNotify";
import UserCardSmall from "@/shared/ui/UserCardSmall";
import { User } from "@root-shared/types/User";
import { useState, useEffect } from "react";

export default function AdminUsersPage() {
  const api = useApi();
  const notifier = useNotify();
  const [users, setUsers] = useState<User[]>([]);

  const onDeleteUser = (id: string) => {
    const result = confirm(
      "Вы точно хотите удалить этого пользователя? Это действие нельзя отменить!",
    );
    if (!result) return;
    api
      .deleteUserById(id)
      .then(() => {
        notifier.notifySuccess("Пользователь успешно удален.", 1000);
        setTimeout(() => navigation.reload(), 1000);
      })
      .catch((error) => notifier.notifyError(error));
  };

  useEffect(() => {
    api
      .getUsers()
      .then((response) => setUsers(response.data))
      .catch((error) => notifier.notifyError(error));
  }, [api]);

  return (
    <main>
      {users.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {users.map((u) => (
            <UserCardSmall key={u.id} {...u} onDeleteUser={onDeleteUser} />
          ))}
        </div>
      ) : (
        <div>Пользователи не найдены. Попробуйте позже.</div>
      )}
    </main>
  );
}
