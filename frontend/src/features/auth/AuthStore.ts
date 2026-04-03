import { makeAutoObservable } from 'mobx';

export class AuthStore {
	accessToken: string | null = null;
	refreshToken: string | null = null;
	userId: string | null = null;
	roles: string[] = [];

	constructor() {
		makeAutoObservable(this);
		this.accessToken = localStorage.getItem('accessToken');
		this.refreshToken = localStorage.getItem('refreshToken');
		this.userId = localStorage.getItem('userId');
		const savedRoles = localStorage.getItem('roles');
		if (savedRoles) {
			try {
				this.roles = JSON.parse(savedRoles);
			} catch {
				this.roles = [];
			}
		}
	}

	setAuth(
		accessToken: string,
		refreshToken: string,
		userId: string,
		roles: string[] = [],
	) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.userId = userId;
		this.roles = roles;
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);
		localStorage.setItem('userId', userId);
		localStorage.setItem('roles', JSON.stringify(roles));
	}

	setTokens(accessToken: string, refreshToken: string) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);
	}

	clearTokens() {
		this.accessToken = null;
		this.refreshToken = null;
		this.userId = null;
		this.roles = [];
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('userId');
		localStorage.removeItem('roles');
	}

	get isAuthenticated() {
		return !!this.accessToken;
	}

	get isAdmin() {
		return this.roles.includes('admin');
	}

	get isSeller() {
		return this.roles.includes('seller');
	}
}

export const authStore = new AuthStore();
