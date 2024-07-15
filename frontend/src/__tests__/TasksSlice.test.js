import tasksReducer, {
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    setTasks,
    setSearchResults,
    setTotalPages,
    clearAllPages,
    setCurrentPage,
    setLoading,
    setIdle,
} from '../features/tasks/tasksSlice';
import axios from 'axios';
import configureMockStore from 'redux-mock-store'
import { thunk } from 'redux-thunk';

// Mock axios
jest.mock('axios');

const localStorageMock = (function () {
    let store = {};
    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        clear() {
            store = {};
        },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares);

const resolvedPromise = (data) => {
    return new Promise((resolve) => {
        resolve({ data });
    });
};

describe('tasksSlice', () => {
    afterEach(() => {
        jest.clearAllMocks();
        window.localStorage.clear();
    });

    describe('reducers', () => {
        const initialState = {
            items: {},
            search: {},
            currentPage: 1,
            totalPages: 1,
            status: 'idle',
            error: null,
        };

        it('should handle initial state', () => {
            expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
        });

        it('should handle setTasks', () => {
            const tasks = [{ id: 1, title: 'Test Task' }];
            const page = 1;
            const sortBy = 'latest';
            const actual = tasksReducer(initialState, setTasks({ tasks, page, sortBy }));
            expect(actual.items['1-latest']).toEqual(tasks);
            expect(actual.status).toBe('succeeded');
        });

        it('should handle setSearchResults', () => {
            const tasks = [{ id: 1, title: 'Search Task' }];
            const search = 'test';
            const page = 1;
            const totalTasks = 1;
            const actual = tasksReducer(initialState, setSearchResults({ tasks, totalTasks, page, search }));
            expect(actual.search[search]).toEqual(tasks);
            expect(actual.search[search].totalTasks).toEqual(totalTasks);
            expect(actual.status).toBe('succeeded');
        });

        it('should handle setTotalPages', () => {
            const totalPages = 5;
            const actual = tasksReducer(initialState, setTotalPages({ totalPages }));
            expect(actual.totalPages).toEqual(totalPages);
        });

        it('should handle clearAllPages', () => {
            const actual = tasksReducer(initialState, clearAllPages());
            expect(actual.items).toEqual({});
            expect(actual.search).toEqual({});
        });

        it('should handle setCurrentPage', () => {
            const currentPage = 2;
            const actual = tasksReducer(initialState, setCurrentPage(currentPage));
            expect(actual.currentPage).toEqual(currentPage);
        });

        it('should handle setLoading', () => {
            const actual = tasksReducer(initialState, setLoading());
            expect(actual.status).toEqual('loading');
        });

        it('should handle setIdle', () => {
            const actual = tasksReducer(initialState, setIdle());
            expect(actual.status).toEqual('idle');
        });
    });

    describe('async actions', () => {
        it('fetchTasks - should fetch tasks and dispatch setTasks on success', async () => {
            const tasks = [{ id: 1, title: 'Test Task' }];
            const totalTasks = 1;
            axios.get.mockReturnValueOnce(resolvedPromise({ tasks, totalTasks, totalPages: 1 }));

            const store = mockStore({ tasks: { tasks: { items: {}, search: {} }, status: 'idle' } });

            await store.dispatch(fetchTasks('', 1, 10, 'latest'));

            const actions = store.getActions();
            expect(actions[0]).toEqual(setLoading());
            expect(actions[1]).toEqual(setTasks({ tasks, totalTasks, page: 1, sortBy: 'latest' }));
            expect(actions[2]).toEqual(setTotalPages({ totalPages: 1 }));
            expect(actions[3]).toEqual(setIdle());
        });

        it('fetchTasks - should fetch search results and dispatch setSearchResults on success', async () => {
            const tasks = [{ id: 1, title: 'Search Task' }];
            const totalTasks = 1;
            axios.get.mockReturnValueOnce(resolvedPromise({ tasks, totalTasks }));

            const store = mockStore({ tasks: { tasks: { items: {}, search: {} }, status: 'idle' } });

            await store.dispatch(fetchTasks('search', 1, 10, 'latest'));

            const actions = store.getActions();
            expect(actions[0]).toEqual(setLoading());
            expect(actions[1]).toEqual(setSearchResults({ tasks, totalTasks, page: 1, search: 'search' }));
            expect(actions[2]).toEqual(setIdle());
        });

        it('addTask - should add a task and dispatch clearAllPages on success', async () => {
            axios.post.mockReturnValueOnce(resolvedPromise({}));

            const store = mockStore({ tasks: { tasks: { items: {}, search: {} }, status: 'idle' } });

            await store.dispatch(addTask({ title: 'New Task' }));

            const actions = store.getActions();
            expect(actions[0]).toEqual(clearAllPages());
        });

        it('updateTask - should update a task and dispatch clearAllPages on success', async () => {
            axios.put.mockReturnValueOnce(resolvedPromise({}));

            const store = mockStore({ tasks: { tasks: { items: {}, search: {} }, status: 'idle' } });

            await store.dispatch(updateTask(1, { status: 'completed', title: 'Updated Task', description: 'Updated Description' }));

            const actions = store.getActions();
            expect(actions[0]).toEqual(clearAllPages());
        });

        it('deleteTask - should delete a task and dispatch clearAllPages on success', async () => {
            axios.delete.mockReturnValueOnce(resolvedPromise({}));

            const store = mockStore({ tasks: { tasks: { items: {}, search: {} }, status: 'idle' } });

            await store.dispatch(deleteTask(1));

            const actions = store.getActions();
            expect(actions[0]).toEqual(clearAllPages());
        });
    });
});
