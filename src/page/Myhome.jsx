import { NavLink } from "react-router-dom";

export function Myhome() {
    return <>

        <div id="myhome">

            <div id="pub"><a href="https://sensiseeds.com/fr/breeding-grounds"><img src="src/assets/photo/pub.png" alt="" /></a></div>

            <div id="product-content">
  <div id="seeds">
    <NavLink className="link manrope" to="/seeds">SEEDS</NavLink>
    <NavLink to="/seeds"><img src="src/assets/photo/seeds.jpg" alt="" /></NavLink>
  </div>

  <div id="clone">
    <NavLink className="link manrope" to="/clone">CLONE</NavLink>
    <NavLink to="/clone"><img src="src/assets/photo/bouture.jpg" alt="" /></NavLink>
  </div>

  <div id="service">
    <NavLink className="link manrope" to="/service">SERVICE</NavLink>
    <NavLink to="/service"><img src="src/assets/photo/service.jpg" alt="" /></NavLink>
  </div>
</div>
        </div>
    </>
}