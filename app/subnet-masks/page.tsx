"use client";

import { H1, H4 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const networkAddressRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const subnetSchema = z.object({
  subnets: z.coerce.number().min(1),
  hosts: z.coerce.number().min(1),
  networkAddress: z
    .string()
    .refine((value) => networkAddressRegex.test(value), {
      message: "Invalid network address format",
    }),
});

const decimalToBinary = (decimal: number) => (decimal >>> 0).toString(2);

const binaryToDecimal = (binary: string) => parseInt(binary, 2);

const masks = {
  A: {
    defaultSubnetMask: "255.0.0.0",
    customSubnetMask: (hosts: number) => {
      let bits = -1;
      for (let i = 0; bits === -1; i++) {
        if (2 ** i > hosts) bits = i;
      }
      let remaining = 24 - bits;
      let binary = "";
      for (let i = 0; i < remaining && i < 8; i++) {
        binary += "1";
      }
      for (let i = 0; i < 8 - remaining; i++) {
        binary += "0";
      }
      remaining -= 8;
      let binary2 = "";
      for (let i = 0; i < remaining && i < 8; i++) {
        binary2 += "1";
      }
      for (let i = 0; i < 8 - remaining; i++) {
        binary2 += "0";
      }
      remaining -= 8;
      let binary3 = "";
      for (let i = 0; i < remaining; i++) {
        binary3 += "1";
      }
      for (let i = 0; i < bits; i++) {
        binary3 += "0";
      }
      const decimal1 = binaryToDecimal(binary);
      const decimal2 = binaryToDecimal(binary2);
      const decimal3 = binaryToDecimal(binary3);
      return `255.${decimal1}.${decimal2}.${decimal3}`;
    },
    bitsBorrowed: (hosts: number) => {
      let bits = -1;
      for (let i = 0; bits === -1; i++) {
        if (2 ** i > hosts) bits = i;
      }
      return 24 - bits;
    },
  },
  B: {
    defaultSubnetMask: "255.255.0.0",
    customSubnetMask: (hosts: number) => {
      let bits = -1;
      for (let i = 0; bits === -1; i++) {
        if (2 ** i > hosts) bits = i;
      }
      let remaining = 16 - bits;
      let binary = "";
      for (let i = 0; i < remaining && i < 8; i++) {
        binary += "1";
      }
      for (let i = 0; i < 8 - remaining; i++) {
        binary += "0";
      }
      remaining -= 8;
      let binary2 = "";
      for (let i = 0; i < remaining; i++) {
        binary2 += "1";
      }
      for (let i = 0; i < bits; i++) {
        binary2 += "0";
      }
      const decimal1 = binaryToDecimal(binary);
      const decimal2 = binaryToDecimal(binary2);
      return `255.255.${decimal1}.${decimal2}`;
    },
    bitsBorrowed: (hosts: number) => {
      let bits = -1;
      for (let i = 0; bits === -1; i++) {
        if (2 ** i > hosts) bits = i;
      }
      return 16 - bits;
    },
  },
  C: {
    defaultSubnetMask: "255.255.255.0",
    customSubnetMask: (hosts: number) => {
      let bits = -1;
      for (let i = 0; bits === -1; i++) {
        if (2 ** i > hosts) bits = i;
      }
      const remaining = 8 - bits;
      let binary = "";
      for (let i = 0; i < remaining; i++) {
        binary += "1";
      }
      for (let i = 0; i < bits; i++) {
        binary += "0";
      }
      const decimal = binaryToDecimal(binary);
      return `255.255.255.${decimal}`;
    },
    bitsBorrowed: (hosts: number) => {
      let bits = -1;
      for (let i = 0; bits === -1; i++) {
        if (2 ** i > hosts) bits = i;
      }
      return 8 - bits;
    },
  },
};

const solve = (values: {
  subnets: number;
  hosts: number;
  networkAddress: string;
}) => {
  const first = Number(values.networkAddress.split(".")[0]);
  const clasa = first < 128 ? "A" : first < 192 ? "B" : "C";

  const defaultSubnetMask = masks[clasa].defaultSubnetMask;
  const customSubnetMask = masks[clasa].customSubnetMask(values.hosts);
  let totalSubnets = 0;
  for (let i = 0; totalSubnets === 0; i++) {
    if (2 ** i >= values.subnets) totalSubnets = 2 ** i;
  }
  let totalHosts = 0;
  for (let i = 0; totalHosts === 0; i++) {
    if (2 ** i >= values.hosts) totalHosts = 2 ** i;
  }
  const usableAdresses = totalHosts - 2;
  const bitsBorrowed = masks[clasa].bitsBorrowed(values.hosts);

  return {
    class: clasa,
    subnets: totalSubnets,
    hostAdresses: totalHosts,
    usableAdresses,
    bitsBorrowed,
    defaultSubnetMask,
    customSubnetMask,
  };
};

type Answer = {
  class: string;
  defaultSubnetMask: string;
  customSubnetMask: string;
  subnets: number;
  hostAdresses: number;
  usableAdresses: number;
  bitsBorrowed: number;
};

export default function SubnetMasks() {
  const [answers, setAnswers] = useState<Answer>(
    // null
    {
      class: "C",
      defaultSubnetMask: "255.255.255.0",
      customSubnetMask: "255.255.255.240",
      subnets: 16,
      hostAdresses: 16,
      usableAdresses: 14,
      bitsBorrowed: 4,
    }
  );

  const form = useForm<z.infer<typeof subnetSchema>>({
    resolver: zodResolver(subnetSchema),
    defaultValues: {
      subnets: 14,
      hosts: 14,
      networkAddress: "192.10.10.0",
    },
  });

  return (
    <div className="md:px-20 px-2 text-center grid gap-10">
      <H1>Subnet Masks</H1>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            setAnswers({ ...answers, ...solve(values) });
          })}
          className="w-fit mx-auto grid gap-5 md:gap-0"
        >
          <FormField
            control={form.control}
            name="subnets"
            render={({ field }) => (
              <FormItem className="md:grid-cols-2 grid items-center gap-x-3 justify-between">
                <FormLabel>Number of needed subnets</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="w-fit" />
                </FormControl>
                <FormMessage className="col-span-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hosts"
            render={({ field }) => (
              <FormItem className="md:grid-cols-2 grid items-center gap-x-3 justify-between">
                <FormLabel>Number of needed usable hosts</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="w-fit" />
                </FormControl>
                <FormMessage className="col-span-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="networkAddress"
            render={({ field }) => (
              <FormItem className="md:grid-cols-2 grid items-center gap-x-3 justify-between">
                <FormLabel>Network address</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="w-fit" />
                </FormControl>
                <FormMessage className="col-span-2" />
              </FormItem>
            )}
          />
          <Button type="submit" className="md:mt-5">
            Submit
          </Button>
        </form>
      </FormProvider>

      {/* <form className="grid gap-10 place-items-center" onSubmit={onSubmit}>
        <div className="grid md:grid-cols-2 gap-3 place-items-start items-center w-fit mx-auto md:max-w-xl bg-blue-500">
          <Label htmlFor="subnets">Number of needed subnets</Label>
          <Input type="number" id="subnets" />
          <Label htmlFor="hosts">Number of needed subnets</Label>
          <Input type="number" id="hosts" />
          <Label htmlFor="hosts">Network Address</Label>
          <div id="hosts" className="flex gap-2 bg-red-500">
            <Input type="number" id="first" className="w-16 md:w-20" />
            <Input type="number" id="second" className="w-16 md:w-20" />
            <Input type="number" id="third" className="w-16 md:w-20" />
            <Input type="number" id="fourth" className="w-16 md:w-20" />
          </div>
        </div>
        <Button type="submit" className="w-full max-w-xl">
          Submit
        </Button>
      </form> */}

      <div className="text-left w-fit mx-auto">
        <H4>Class: {answers.class}</H4>
        <H4>Default subnet mask: {answers.defaultSubnetMask}</H4>
        <H4>Custom subnet mask: {answers.customSubnetMask}</H4>
        <H4>Total number of subnets: {answers.subnets}</H4>
        <H4>Total number of host addresses: {answers.hostAdresses}</H4>
        <H4>Number of usable addresses: {answers.usableAdresses}</H4>
        <H4>Number of bits borrowed: {answers.bitsBorrowed}</H4>
      </div>
    </div>
  );
}
