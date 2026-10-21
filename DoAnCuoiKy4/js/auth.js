const KEY_USERS = "users";
const KEY_CURRENT = "currentUser";

function layUsers() {
  const raw = localStorage.getItem(KEY_USERS);
  if (raw === null) return [];

  try {
    const users = JSON.parse(raw);
    if (!Array.isArray(users)) throw new TypeError("Dữ liệu users phải là một mảng.");
    return users;
  } catch (error) {
    console.error("Không thể đọc danh sách tài khoản trong localStorage.", error);
    return [];
  }
}

function luuUsers(users) {
  if (!Array.isArray(users)) throw new TypeError("Danh sách tài khoản phải là một mảng.");
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
}

function layCurrent() {
  const raw = localStorage.getItem(KEY_CURRENT);
  if (raw === null) return null;

  try {
    const user = JSON.parse(raw);
    return user && typeof user === "object" ? user : null;
  } catch (error) {
    console.error("Không thể đọc tài khoản hiện đang đăng nhập.", error);
    return null;
  }
}

function luuCurrent(user) {
  if (user) localStorage.setItem(KEY_CURRENT, JSON.stringify(user));
  else localStorage.removeItem(KEY_CURRENT);
}

function seedUsers() {
  const users = layUsers();
  if (users.length > 0) return users;

  const seededUsers = [
    {
      id: "U001",
      username: "admin",
      password: "admin123",
      hoTen: "Quản trị viên",
      email: "admin@sgu.edu.vn",
      role: "admin",
      locked: false,
      createdAt: "2026-10-01",
    },
    {
      id: "U002",
      username: "customer01",
      password: "123456",
      hoTen: "Nguyễn Văn A",
      email: "a@gmail.com",
      role: "customer",
      locked: false,
      createdAt: "2026-10-05",
    },
    {
      id: "U003",
      username: "customer02",
      password: "123456",
      hoTen: "Trần Thị B",
      email: "b@gmail.com",
      role: "customer",
      locked: false,
      createdAt: "2026-10-06",
    },
  ];

  luuUsers(seededUsers);
  return seededUsers;
}

seedUsers();
