export class ConstantsComponent {
  // COLLECTIONS

  public static users_collection = "users";
  public static profile_collection = "profile";
  public static estados_collection = "estados";
  public static partidos_collection = "partidos";
  public static valores_collection = "valores";

  public static categorie_collection = "categories";
  public static settings_collection = "settings";

  public static notifications_collection = "notifications";
  public static proposals_collection = "proposals";
  public static comments_collection = "comments";
  //TODO PONER URLS SI SE USARA ALMACENAMIENTO EN LA NUBE
  public static url_storage = "https://firebasestorage.googleapis.com/v0/b/campaignbuap.firebasestorage.app/o";
  public static store_url = 'gs://campaignbuap.firebasestorage.app';
  public static success = "success";
  public static error = "error";
  public static companyId = "companyId";
  public static userId = "userId";
  public static rol = "rol";
  public static empresaSuscrita_id = "empresaSuscrita_id";
  public static empresa_asignada = "empresa_Asignada";
  public static company = "company";
  public static areas = "areas";
  public static tasks = "tasks";
  public static task_secuence = "task_secuence";
  public static notifications = "notifications";

  //Email SMTP
  public static email_token = "";
  public static from_email = "";
}
