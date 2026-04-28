import bcrypt from "bcrypt";

// Sistema simples de autenticação admin sem banco de dados
interface AdminUser {
  id: number;
  username: string;
  password: string;
  displayName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

// Usuários admin padrão
const DEFAULT_ADMIN: AdminUser = {
  id: 1,
  username: "jrmkt",
  password: bcrypt.hashSync("JR@a4xpc2zs", 10), // Senha atualizada
  displayName: "João Roberto",
  email: "admin@pollyfort.com",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
};

const ADMIN_USER: AdminUser = {
  id: 2,
  username: "admin",
  password: bcrypt.hashSync("997649459@@", 10),
  displayName: "Administrador",
  email: "admin@pollyfort.com", 
  role: "admin",
  isActive: true,
  createdAt: new Date(),
};

// Base de dados em memória para usuários admin
let adminUsers: AdminUser[] = [DEFAULT_ADMIN, ADMIN_USER];
let nextUserId = 3;

export class AdminAuthService {
  static async verifyCredentials(username: string, password: string): Promise<AdminUser | null> {
    const user = adminUsers.find(u => u.username === username && u.isActive);
    
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  static async getUser(id: number): Promise<AdminUser | null> {
    return adminUsers.find(u => u.id === id && u.isActive) || null;
  }

  static async getUserByUsername(username: string): Promise<AdminUser | null> {
    return adminUsers.find(u => u.username === username) || null;
  }

  static async getAllUsers(): Promise<Omit<AdminUser, 'password'>[]> {
    return adminUsers.map(({ password, ...user }) => user);
  }

  static async createUser(userData: {
    username: string;
    password: string;
    displayName: string;
    email: string;
    role?: string;
    isActive?: boolean;
  }): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser: AdminUser = {
      id: nextUserId++,
      username: userData.username,
      password: hashedPassword,
      displayName: userData.displayName,
      email: userData.email,
      role: userData.role || "admin",
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: new Date(),
    };

    adminUsers.push(newUser);
    return newUser;
  }

  static async updateUser(id: number, updates: Partial<AdminUser>): Promise<AdminUser | null> {
    const userIndex = adminUsers.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    adminUsers[userIndex] = { ...adminUsers[userIndex], ...updates };
    return adminUsers[userIndex];
  }

  static async deleteUser(id: number): Promise<boolean> {
    const userIndex = adminUsers.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    adminUsers.splice(userIndex, 1);
    return true;
  }

  static async updateLastLogin(id: number): Promise<void> {
    const user = adminUsers.find(u => u.id === id);
    if (user) {
      user.lastLogin = new Date();
    }
  }
}