from references import strings as sref
import os.path

def query_name_setup(base_folder):

    data_folder = os.path.join(base_folder, sref.DATA_FOLDER_NAME)
    query_folder = ""
    query_name = ""

    while os.path.exists(query_folder) or query_name == "":
        query_name = input("Enter Name for your Query: ")

        query_folder = os.path.join(data_folder, query_name)

        if not os.path.exists(data_folder):
            os.mkdir(data_folder)

        if os.path.exists(query_folder):
            print("That Name is Already Being Used for a Folder!")

    os.mkdir(query_folder)

    return query_folder

    