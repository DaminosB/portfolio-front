import Module_Fullpage from "@/modules/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/modules/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/modules/Module_Container/Module_Container";
import Module_Text from "@/modules/Module_Text/Module_Text";

const ModulesDisplayer = ({ modules, customColors }) => {
  return modules.map((module) => {
    if (module.__component === "module.texte") {
    }
    switch (module.__component) {
      case "module.pleine-page":
        return (
          <Module_Fullpage
            key={module.id}
            module={module}
            customColors={customColors}
          />
        );

      case "module.colonne-multi-images":
        return (
          <Module_MultiImagesColumn
            key={module.id}
            module={module}
            customColors={customColors}
          />
        );

      case "module.container":
        return (
          <Module_Container
            key={module.id}
            module={module}
            customColors={customColors}
          />
        );

      case "module.texte":
        return (
          <Module_Text
            key={module.id}
            module={module}
            customColors={customColors}
          />
        );

      default:
        break;
    }
  });
};

export default ModulesDisplayer;
