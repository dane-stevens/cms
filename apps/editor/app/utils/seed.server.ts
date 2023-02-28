import { createId } from "@paralleldrive/cuid2";
import { client } from "./redis.server";

const blog = {
  title: "Page Title",
  description: "A page description here",
  children: [
    {
      id: createId(),
      component: "Card",
      data: {
        gridCols: 2,
        mdGridCols: 5,
      },
      children: [
        {
          id: createId(),
          component: "CardSection",
          data: {
            title: "section title 2",
            children: "hey there",
          },
        },
        {
          id: createId(),
          component: "CardSection",
          data: {
            title: "section title 2",
            children: "hey there",
          },
        },
        {
          id: createId(),
          component: "CardSection",
          data: {
            title: "section title 2",
            children: "hey there",
          },
        },
      ],
    },
    {
      id: createId(),
      component: "Card",
      data: {
        gridCols: 3,
        mdGridCols: 2,
      },
      children: [
        {
          id: createId(),
          component: "CardSection",
          data: {
            title: "Company Title",
            children: "President",
          },
        },
        {
          id: createId(),
          component: "CardSection",
          data: {
            title: "Employee Name",
            children: "Katie",
          },
        },
        {
          id: createId(),
          component: "CardSection",
          data: {
            title: "section title 2",
            children: "hey there",
          },
        },
      ],
    },
    {
      id: createId(),
      component: "CustomCard",
    },
  ],
};

const blogPost1 = {
  title: "Blog Post #1",
  description: "A page description here",

  children: [
    {
      id: createId(),
      component: "Card",
      children: [
        {
          id: createId(),
          component: "Paragraph",
          data: {
            children: "Hello world",
          },
        },
        {
          id: createId(),
          component: "Paragraph",
          data: {
            children: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc suscipit purus non interdum sollicitudin. Nunc pulvinar augue eu quam consequat, vitae bibendum nisi ultricies. Donec ultricies libero in luctus rhoncus. Proin ipsum dolor, vulputate vulputate est posuere, laoreet ultricies nisl. Curabitur maximus eget lacus eu aliquet. Morbi laoreet fringilla ipsum vel gravida. Nulla ac ante diam. Maecenas augue nisl, sodales vel tellus id, porttitor finibus risus. Quisque pharetra mi vel nibh suscipit, in iaculis eros cursus. Sed eget elit consectetur, sagittis velit non, suscipit mauris. Nullam eu purus volutpat, egestas sem ac, facilisis lorem. Donec a tortor ultricies, viverra metus at, laoreet augue. Vivamus tempus, massa vulputate tempor ullamcorper, magna nisi egestas ipsum, eget fermentum metus enim id nunc.
  
              Proin eget sem pulvinar, dictum mi at, posuere odio. Maecenas sit amet lacinia ante. In vel arcu lectus. Fusce blandit, massa sit amet efficitur vehicula, tortor lorem malesuada orci, at semper ligula dui et sapien. Etiam a odio id massa varius ornare vitae sit amet lorem. Etiam faucibus orci eu leo euismod sodales. Maecenas volutpat mollis sodales. Praesent condimentum pharetra eros vel pharetra. Nam ornare porttitor risus, nec sodales turpis accumsan a. Vivamus in luctus lacus, id bibendum purus. Suspendisse in eleifend magna. Quisque euismod eros ac magna commodo lacinia. Cras libero purus, tincidunt non orci non, accumsan molestie augue.
              
              Maecenas vestibulum luctus fringilla. Maecenas enim massa, aliquet vel arcu ut, gravida tincidunt leo. Nam tincidunt diam at metus feugiat ornare. Donec ut dapibus erat, vel dapibus urna. Suspendisse potenti. Suspendisse potenti. Aliquam id ipsum tincidunt, hendrerit purus non, commodo nisl. Aliquam tristique urna a vestibulum molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
              
              Sed placerat tortor vel ornare cursus. Mauris non leo sed felis euismod gravida. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris sit amet mattis purus, ut viverra arcu. Donec orci purus, varius vitae risus non, sodales sodales tortor. Maecenas lobortis nibh massa, nec dapibus ante semper sed. Fusce at metus orci. Suspendisse aliquet tincidunt erat. Fusce quis mi diam. Mauris at massa quis justo faucibus eleifend tempor sed dolor. In ultricies at lacus quis porta. Sed id nisi egestas, luctus urna non, sodales massa. Aliquam lorem risus, vestibulum quis auctor eu, interdum id tortor. Ut nibh leo, hendrerit in vehicula et, pretium ac augue. Praesent suscipit ante sit amet mauris sodales, non euismod dui semper. Maecenas malesuada nunc gravida leo fermentum commodo.
              
              Vivamus ac lobortis risus. Vivamus semper mollis mi vitae bibendum. Cras ornare nisl metus, vitae ultricies mi convallis sed. Quisque ipsum sem, maximus non tellus sed, lacinia condimentum lacus. Maecenas nec vestibulum tortor. Morbi bibendum consequat neque, at faucibus velit consectetur a. Maecenas nec pharetra orci. Curabitur molestie condimentum interdum. Phasellus egestas lacus sed placerat dapibus. Nullam dictum cursus libero, et consequat nisi finibus nec. Mauris sollicitudin elit dolor, in condimentum eros condimentum luctus. Phasellus lobortis varius tellus vel varius. Vivamus pellentesque augue libero, et consequat magna facilisis et.
              
              `,
          },
        },
        {
          id: createId(),
          component: "Link",
          data: {
            to: "/blog",
            children: "Click me!",
          },
        },
      ],
    },
  ],
};

export function seed() {
  client.json.set(`tenent:skr5pte9guegsgk2u7bw92uq:page:/blog`, ".", blog);
  client.json.set(
    `tenent:skr5pte9guegsgk2u7bw92uq:page:/blog/post1`,
    ".",
    blogPost1
  );
}
