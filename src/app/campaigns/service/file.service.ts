import { Injectable } from "@angular/core";
import { ConstantsComponent } from "../../shared/constants.component";
import { CrudService } from "./crud.service";
import { Proposal } from "src/app/shared/interfaces/proposal.interface";

@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private crudService: CrudService) {}

  async uploadFile(file: any,path:String) :Promise<String>{
    try {
      const uploadeFile = await this.crudService.saveImage(file,path);
      return uploadeFile;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return null;
    }
  }

  async removeFile(url:string){
    try{
      console.log(url)
        const removeFile = await this.crudService.deleteFile(ConstantsComponent.url_storage + url)
        return removeFile
    }
    catch(error){
      return false
    }
  }
}
