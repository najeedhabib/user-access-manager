import React, { useState } from "react";
import {
  ActionRequestActionEnum,
  UpdateUserRequest,
  User,
  UserActionsEnum,
  UserControllerApi,
} from "../services/openapi";

interface EditUserModalProps {
  onClosed: () => void;
  onUpdated: () => void;
  user: User;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  onClosed,
  onUpdated,
  user,
}) => {
  const id = user.id!;
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [selectedActions, setSelectedActions] = useState<UserActionsEnum[]>(
    user.actions || []
  );
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as UserActionsEnum;
    const updatedList = [...selectedActions] as UserActionsEnum[];

    if (e.target.checked) {
      if (!updatedList.includes(value)) {
        updatedList.push(value);
      }
    } else {
      const index = updatedList.indexOf(value);
      if (index !== -1) {
        updatedList.splice(index, 1);
      }
    }

    setSelectedActions(updatedList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      const updateUserRequest: UpdateUserRequest = {
        id: id,
        user: {
          firstName,
          lastName,
          email,
          actions: [...selectedActions],
        },
      };
      const api = new UserControllerApi();
      await api.updateUser(updateUserRequest);

      // Reset the form fields
      setFirstName("");
      setLastName("");
      setEmail("");
      onUpdated();
    } catch (error) {
      alert(error);
    }
  };

  const getDisplayLabel = (key: string) => {
    return key.replace(/([A-Z])/g, " $1").toUpperCase();
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-60 md:w-96 lg:w-[600px]">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5">
              <h3 className="text-2xl font-semibold">Edit User</h3>
              <button
                className=" ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none align-middle font-semibold outline-none focus:outline-none"
                onClick={onClosed}
              >
                <span className="bg-transparent h-6 w-6 opacity-50 text-xl block outline-none focus:outline-none text-black">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative m-6 flex-auto">
              <div className="flex mb-2 h-8">
                <span className="font-medium w-24 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-100 border border-r-0 border-gray-300 rounded-sm dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  Firstname
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Max"
                />
              </div>
              <div className="flex mb-2 h-8">
                <span className="font-medium w-24 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-100 border border-r-0 border-gray-300 rounded-sm dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  Lastname
                </span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Mustermann"
                />
              </div>
              <div className="flex mb-2 h-8">
                <span className="font-medium w-24 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-100 border border-r-0 border-gray-300 rounded-sm dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  E-Mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="m.mustermann@test.de"
                />
              </div>
              <div className="mt-3">
                <label className="block font-medium mb-2 text-base">
                  Actions
                </label>
                <div className="flex flex-col space-y-2 ml-4">
                  {Object.entries(ActionRequestActionEnum).map(
                    ([key, value]) => (
                      <label key={value}>
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          value={value}
                          checked={selectedActions.includes(value)}
                          onChange={handleCheck}
                        />
                        <span className="ml-2">{getDisplayLabel(key)}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6">
              <button
                className="bg-gray-200 text-black active:bg-gray-400 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-3 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={onClosed}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default EditUserModal;
