---
name: add-api-endpoint
description: Best practices for adding new endpoints to API services.
---

# Add API Endpoint

Standardized way to add new API methods using the project's service pattern with loading state management.

## Patterns

### 1. Composition with Loading State

Services must compose `useLoading` with `createApiClient` to handle loading states automatically.

```typescript
// src/composables/services/useYourService.ts
import { createApiClient } from '@/services/baseApiService';
import { useLoading } from '@/composables/useLoading';

export const useYourService = () => {
  // 1. Initialize loading state
  const { loading, error, withLoading } = useLoading();

  // 2. Create API client passing the loading wrapper
  const api = createApiClient({ withLoading });

  // ... define methods

  // 3. Return loading and error along with methods
  return {
    loading,
    error,
    // ... methods
  };
};
```

### 2. Method Definition

Define request methods using the initialized `api` instance. Do not use `async/await` inside the service methods unless necessary; return the Promise directly.

```typescript
// GET
const getUser = (id: number) => api.get<UserResponse>(`users/${id}`);

// POST
const createUser = (data: CreateUserDto) => api.post<UserResponse>('users', data);
```

### 3. Typing

Define interfaces for Requests and Responses (DTOs) in the same file or a dedicated types file if shared.

```typescript
interface UserResponse {
  id: number;
  name: string;
}
```

## Complete Example

```typescript
// src/composables/services/useUserService.ts
import { createApiClient } from '@/services/baseApiService';
import { useLoading } from '@/composables/useLoading';

interface User {
  id: number;
  name: string;
}

interface CreateUserDto {
  name: string;
}

export const useUserService = () => {
  const { loading, error, withLoading } = useLoading();
  const api = createApiClient({ withLoading });

  const getUser = (id: number) => api.get<User>(`users/${id}`);

  const getUsers = () => api.get<User[]>('users');

  const createUser = (data: CreateUserDto) => api.post<User>('users', data);

  const updateUser = (id: number, data: Partial<CreateUserDto>) => api.put<User>(`users/${id}`, data);

  const deleteUser = (id: number) => api.delete<void>(`users/${id}`);

  return {
    loading,
    error,
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
```
