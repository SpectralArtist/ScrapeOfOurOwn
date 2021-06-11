import strings as sref
import os.path

def query_name_setup(base_folder):

    data_folder = os.path.join(base_folder, sref.DATA_FOLDER_NAME)
    query_folder = ""
    query_name = ""

    while os.path.exists(query_folder) or query_name == "":
        query_name = input("Enter Name for your Query: ")

        query_folder = os.path.join(data_folder, query_name)

        create_folder(data_folder)

        if os.path.exists(query_folder):
            print("That Name is Already Being Used for a Folder!")

    os.mkdir(query_folder)

    return query_folder

def create_folder(folder_path):
    if not os.path.exists(folder_path):
            os.mkdir(folder_path)

def create_sub_folder(folder_path, name):
    sub_folder = os.path.join(folder_path, name.replace('/', ''))
    if not os.path.exists(sub_folder):
        os.mkdir(sub_folder)
    return sub_folder
