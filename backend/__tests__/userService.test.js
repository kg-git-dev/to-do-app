import { createUser, findUserByUsername, findUserById } from '../models/User';
import { getDB } from '../mongodb.js';
import { ObjectId } from 'mongodb';

jest.mock('../mongodb.js');
const mockDb = {
    collection: jest.fn().mockReturnThis(),
    insertOne: jest.fn(),
    findOne: jest.fn()
};

getDB.mockReturnValue(mockDb);

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new user', async () => {
        const username = 'testuser';
        const password = 'password123';

        const mockInsertResult = { acknowledged: true, insertedId: new ObjectId() };
        mockDb.insertOne.mockResolvedValueOnce(mockInsertResult);

        const user = await createUser(username, password);

        expect(mockDb.collection).toHaveBeenCalledWith('users');
        expect(mockDb.insertOne).toHaveBeenCalledWith({ username, password: expect.any(String) });
        expect(user).toEqual({ _id: mockInsertResult.insertedId, username });
    });

    it('should throw an error when the username already exists', async () => {
        const username = 'testuser';
        const password = 'password123';
    
        const duplicateKeyError = new Error('E11000 duplicate key error collection');
        duplicateKeyError.code = 11000;
        mockDb.insertOne.mockRejectedValueOnce(duplicateKeyError);
    
        await expect(createUser(username, password)).rejects.toThrow('Username already exists');
      });

    it('should throw an error if the password is less than 8 characters', async () => {
        const username = 'testuser';
        const shortPassword = 'pass';

        await expect(createUser(username, shortPassword)).rejects.toThrow('Password must be at least 8 characters long');
    });

    it('should throw an error if the username is only spaces or empty', async () => {
        const emptyUsername = '     ';
        const password = 'password123';

        await expect(createUser(emptyUsername, password)).rejects.toThrow('Username must be at least one character long and cannot be just spaces');
    });

    it('should find a user by username', async () => {
        const username = 'testuser';
        const user = { username };
        mockDb.findOne.mockResolvedValueOnce(user);

        const foundUser = await findUserByUsername(username);

        expect(mockDb.collection).toHaveBeenCalledWith('users');
        expect(mockDb.findOne).toHaveBeenCalledWith({ username });
        expect(foundUser).toEqual(user);
    });

    it("should throw an error when username is invalid", async () => {
        const invalidUserName = 'invalidUserName';

        await expect(findUserByUsername(invalidUserName)).rejects.toThrow('Failed to find by username')
    })

    it('should find a user by ID', async () => {
        const userId = new ObjectId().toString();
        const user = { _id: ObjectId.createFromHexString(userId), username: 'testuser' };
        mockDb.findOne.mockResolvedValueOnce(user);

        const foundUser = await findUserById(userId);

        expect(mockDb.collection).toHaveBeenCalledWith('users');
        expect(mockDb.findOne).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString(userId) });
        expect(foundUser).toEqual(user);
    });

    it('should throw an error if the user ID is invalid', async () => {
        const invalidUserId = 'invalidUserId';

        await expect(findUserById(invalidUserId)).rejects.toThrow('Failed to find user by ID');
    });
});
