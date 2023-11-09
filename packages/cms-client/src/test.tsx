// interface TComponentProp {
//   [key: string]: typeof text;
// }

// interface CMSProp<TName extends string, TDataType extends string> {
//   name: TName;
//   dataType: TDataType;
// }

// class CMSProp<TName extends string, TDataType extends string> {
//   readonly name: string;
//   readonly notNull: boolean;

//   protected config;

//   constructor(name: TName, dataType: TDataType) {
//     this.name = name;
//   }

// }

// type CMSDataTypes = "string" | "number";

// function string<TPropName extends string>(name: TPropName) {
//   return { name, dataType: "string" as const };
// }

// function integer<TPropName extends string>(name: TPropName) {
//   return { name, dataType: "number" as const };
// }

// function cmsComponent<
//   TComponentName extends string,
//   TComponentProps extends Record<string, CMSProp>,
// >(name: TComponentName, props: TComponentProps) {
//   return {
//     name,
//     props,
//   };
// }

// const CardSchema = cmsComponent("card", {
//   gridCols: string("gridCols"),
//   flexCols: integer("flexCols"),
// });

// console.log(Card);

// function Card({ gridCols, flexCols }: typeof CardSchema.props) {
//   return <div style={{ gridTemplateColumns: gridCols }}>hi</div>;
// }

// class CMSType<Output = any, Def = any, Input = Output> {

//   readonly _type!: Output
//   readonly _output!: Output
//   readonly _input!: Input
//   readonly _def!: Def

//   parse(input: unknown) {
//     return input
//   }

// }

// const test = new CMSType().parse({'test':'test'})
