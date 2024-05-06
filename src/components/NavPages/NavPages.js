// No style so it can be set directly in the parnet component

// Next components
import Link from "next/link";
import ContactModale from "../ContactModale/ContactModale";

const NavPages = ({ profile, pages, style }) => {
  return (
    <nav>
      {/* The pages created by the user are displayed through a .map function */}
      {pages.map((page, index) => {
        return (
          <Link key={page.id} href={`/user-pages/${page.id}`}>
            {page.name}
          </Link>
        );
      })}

      {/* The Contact page is created by default */}
      {/* <Link href="/contact">Contact</Link> */}
      <ContactModale profile={profile} style={style} />
    </nav>
  );
};

export default NavPages;
