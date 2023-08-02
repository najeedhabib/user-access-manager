import React, { useState } from "react";
import {
  ActionRequest,
  ActionRequestActionEnum,
  User,
  UserActionsEnum,
  UserControllerApi,
} from "../services/openapi";

interface RunActionModalProps {
  onClosed: () => void;
  onUpdated: () => void;
  user: User;
}

const RunActionModal: React.FC<RunActionModalProps> = ({
  onClosed,
  onUpdated,
  user,
}) => {
  const id = user.id!;
  const [selectedAction, setSelectedAction] = useState<UserActionsEnum>(
    UserActionsEnum.CreateItem
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const actionRequestData: ActionRequest = {
        userId: id,
        action: selectedAction,
      };
      const api = new UserControllerApi();
      await api.validateAction({ actionRequest: actionRequestData });
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
              <h3 className="text-2xl font-semibold">Run action</h3>
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
              <div className="mt-3">
                <label className="block font-medium mb-2 text-base">
                  Actions
                </label>
                <div className="flex flex-col space-y-2 ml-4">
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={selectedAction}
                    onChange={(e) =>
                      setSelectedAction(e.target.value as UserActionsEnum)
                    }
                  >
                    {Object.entries(ActionRequestActionEnum).map(
                      ([key, value]) => (
                        <option key={value} value={value}>
                          {getDisplayLabel(key)}
                        </option>
                      )
                    )}
                  </select>
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
                Run
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default RunActionModal;
