export type Message = {
  id: string,
  agenda_id: string,
  value: string,
  created_by: string,
  created_date: string,
  last_modification_by: string,
  last_modified_datetime: string,
  status_id: string
}

export type GroupMessage = {
  id: string,
  group_agenda_id: string,
  value: string,
  created_by: string,
  created_date: string,
  last_modification_by: string,
  last_modified_datetime: string,
  status_id: string,
  activity_session_id: string,
  name: string
}

export type PlanitouFile = {
  id: string,
  type: string,
  filename: string,
  extension: string,
  path: string,
  dateAjout: string,
  idUserAjoute: string,
  idObjet: string,
  md5: string,
  status_id: string,
  agenda_file_id: string,
  agenda_id: string,
  docFichier_id: string,
  file: string
}

export type AgendaEntry = {
  id: string,
  child_id: string,
  agenda_date: string,
  status: string,
  motif: string,
  private: string,
  number_1: string,
  number_2: string,
  recess_am_quantity: string,
  recess_am_time: string,
  recess_pm_quantity: string,
  recess_pm_time: string,
  created_by: string,
  created_date: string,
  last_modified_by: string,
  last_modified_datetime: string,
  deleted: string,
  agenda_viewed: [],
  child: {
    id: string,
    first_name: string,
    last_name: string,
    birthday: string,
    date_premiere_freq: string,
    date_inscription: string,
    date_creation: string,
    avatar: string,
    groups: [],
    activities: string[]
  },
  author: {
    id: string,
    first_name: string,
    last_name: string,
    prenom: string,
    nom: string,
    typeUser: string,
    signature_file_id: string,
    avatar: string
  },
  title: string,
  start: string,
  allDay: string,
  color: string,
  display: string,
  files: PlanitouFile[],
  comments: string[],
  custom_messages: string[],
  health_notes: string[],
  activity_notes: [string],
  messages: Message[],
  activity_session_groups: string[],
  activity_sessions: string[],
  group_messages: GroupMessage[],
  measurable_elements: string[]
}

export type Agenda = {
  data: AgendaEntry[],
  message: string,
  token: string,
}

export type Option = {
  data: DataOption,
  message: string,
  token: string,
}

export type ASP = {
  id: string,
  activity_session_id: string,
  parent_activity_session_id: string,
  activity_session_group_id: string,
  user_id: string,
  created_by: string,
  created_date: string,
  site_id: string
};

export type Children = {
  id: string,
  uid: string,
  fn: string,
  ln: string,
  dob: string,
  e: string,
  sd: string,
  di: string,
  dpf: string,
  dc: string,
  asp: ASP[],
  activity_session_groups: string[],
  activity_sessions: string[]
};
export type Educatrice = {
  id: string,
  tu: string,
  s: string,
  fn: string,
  ln: string
};

export type Alergen = {
  id: string,
  nom: string,
  enfant_id: null,
  custom: null
};

export type Parent = {
  id: string,
  uid: string,
  fn: string,
  ln: string
};

export type ResponseType = {
  id: string,
  label: string,
  slug: string
};

export type VFIconfig = {
  vfi_1_from: number;
  vfi_1_to: number;
  vfi_2_from: number;
}

export type DataOption = {
  sites: string[];
  activity_session_groups: string[];
  activity_sessions: string[];
  timezone: string;
  timezone_offset: string;
  date: string;
  gmdate: string;
  has_weekend: string;
  milieux: string;
  type_etab: string;
  heures_ouverture: [[string, string]];
  children: Children[];
  educatrices: Educatrice[];
  program: string;
  allergenes: Alergen[];
  parents: Parent[];
  responseTypes: ResponseType[];
  vfi_config: VFIconfig;
}

export const file = async (token: string, id: number) => {
  const file_endpoint = `https://310.planitou.ca/api/v1/file?f=${id}`
  const response = await fetch(file_endpoint, {
    method: 'GET',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'authorization': token,
    },
  });

  if (!response.ok) return undefined;
  const imageBlob = await response.blob();
  return imageBlob;
}
export const search = async (token: string, children_id: number, start: string, end: string) => {
  const search_endpoint = 'https://310.planitou.ca/api/v1/agenda/search';
  const content = {
    start_date: start,
    end_date: end,
    child_id: children_id,
  }

  const response = await fetch(search_endpoint, {
    method: 'POST',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'authorization': token,
    },
    body: JSON.stringify(content),
    credentials: 'include'
  });

  return await response.json() as Agenda;
}

export const options = async (token: string) => {
  const option_endpoint = 'https://310.planitou.ca/api/v1/profile/options';
  const response = await fetch(option_endpoint, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'authorization': token,
    }
  });
  if (!response) return undefined;

  return await response.json() as Option;
};
