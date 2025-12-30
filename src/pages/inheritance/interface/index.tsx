export interface Person {
  name: string;
  sex: "Male" | "Female";
  birth_year: string;
  spouses: Person[];
  parents: Person[];
  children: Person[];
  death_certificate?: DeathCertificate;
}

export interface DeathCertificate {
  id: string;
  died_date: string;
  issued_date: string;
  issued_by: string;

}

export interface Inheritance {
  decedent: Person;
  property: {
    id: string;
  };
}

// const payload = {
//     id: "96/TLKT",
//     died_date: "16/12/2024",
//     issued_date: "16/12/2024",
//     issued_by: "UBND",
//     issued_by_address_old: "phường Văn Quán, quận Hà Đông, thành phố Hà Nội",
//     issued_by_address: "phường Hà Đông, thành phố Hà Nội",
// }